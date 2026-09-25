import { ListXIcon } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/app/components/ui/button'
import { DataTableList } from '@/app/components/ui/data-table-list'
import { Separator } from '@/app/components/ui/separator'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { queueColumns } from '@/app/tables/queue-columns'
import {
  usePlayerActions,
  usePlayerContext,
  usePlayerCurrentList,
  usePlayerCurrentSongIndex,
} from '@/store/player.store'
import { ColumnFilter } from '@/types/columnFilter'
import { PlaybackSource } from '@/types/playerContext'
import { convertSecondsToHumanRead } from '@/utils/convertSecondsToTime'

export function QueueSongList() {
  const { t } = useTranslation()
  const currentList = usePlayerCurrentList()
  const currentSongIndex = usePlayerCurrentSongIndex()
  const { clearQueue, moveSongInQueue, setSongList } = usePlayerActions()
  const { source } = usePlayerContext()

  const columns = useMemo(() => queueColumns(), [])
  const trackListCount = useMemo(() => currentList.length, [currentList])

  const trackListDuration = useMemo(() => {
    let minutes = 0
    currentList.forEach((song) => (minutes += song.duration))

    return convertSecondsToHumanRead(minutes)
  }, [currentList])

  const columnsToShow: ColumnFilter[] = ['index', 'title', 'duration', 'remove']

  function getSourceLabel(source: PlaybackSource | null) {
    if (!source) return null

    return source.name
  }

  const sourceLabel = getSourceLabel(source)

  return (
    <div className="flex flex-1 flex-col h-full min-w-0">
      <div className="flex items-center justify-between gap-2 h-8 mb-2">
        <div className="flex gap-1.5 items-center text-muted-foreground text-xs whitespace-nowrap min-w-0">
          {sourceLabel && (
            <>
              <span className="truncate text-foreground">{sourceLabel}</span>
              <span className="shrink-0">{'•'}</span>
            </>
          )}
          <span className="shrink-0">
            {t('playlist.songCount', { count: trackListCount })}
          </span>
          <span className="shrink-0">{'•'}</span>
          <span className="shrink-0">
            {t('playlist.duration', { duration: trackListDuration })}
          </span>
        </div>

        <SimpleTooltip text={t('queue.clear')}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-md"
            onClick={clearQueue}
          >
            <ListXIcon className="w-4 h-4" />
          </Button>
        </SimpleTooltip>
      </div>
      <Separator />

      <div className="w-full h-full overflow-auto">
        <DataTableList
          data={currentList}
          columns={columns}
          columnFilter={columnsToShow}
          showHeader={false}
          handlePlaySong={(row) =>
            setSongList(currentList, row.index, undefined, source)
          }
          scrollToIndex={true}
          currentSongIndex={currentSongIndex}
          allowRowSelection={false}
          showContextMenu={false}
          pageType="queue"
          onRowMove={moveSongInQueue}
        />
      </div>
    </div>
  )
}
