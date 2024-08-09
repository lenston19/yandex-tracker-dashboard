import { Yandex } from '~/types/yandex';

export interface CollectedWorklog {
	key: string;
	items: Yandex.Worklog[];
}

export interface QueueWorklogs {
  queueName: string;
  worklogs: CollectedWorklog[];
}


export function collectWorklogs(worklogs: Yandex.Worklog[]) {
  const groupedWorklogs = new Map<string, Yandex.Worklog[]>();

  worklogs.forEach((worklog) => {
    const issueKey = worklog.issue.key;

    if (groupedWorklogs.has(issueKey)) {
      groupedWorklogs.get(issueKey)!.push(worklog);
    } else {
      groupedWorklogs.set(issueKey, [worklog]);
    }
  });

  const result: CollectedWorklog[] = Array.from(groupedWorklogs.keys()).map(
    (key) => ({
      key,
      items: groupedWorklogs.get(key) || [],
    })
  );

  return { result: result, groupedWorklogs: groupedWorklogs };
}

export function collectWorklogsByQueue(
  queues: Yandex.Queue[],
  worklogs: Yandex.Worklog[]
): QueueWorklogs[] {
  const groupedWorklogs = collectWorklogs(worklogs).groupedWorklogs;
  const result: QueueWorklogs[] = [];

  for (const queue of queues) {
    const matchedWorklogs = Array.from(groupedWorklogs.keys())
      .filter((issueKey) => issueKey.startsWith(queue.key))
      .map((issueKey) => ({
        key: issueKey,
        items: groupedWorklogs.get(issueKey) || [],
      }));

    if (matchedWorklogs.length > 0) {
      result.push({
        queueName: queue.name,
        worklogs: matchedWorklogs,
      });
    }
  }

  return result;
}
