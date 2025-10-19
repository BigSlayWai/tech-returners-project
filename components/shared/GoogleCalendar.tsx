import { Button } from '@/components/ui/button';

type Props = {
  title: string;
  description?: string;
  location?: string;
  start: Date | string;
  end: Date | string;
};

function toGCalDate(value: Date | string) {
  const d = typeof value === 'string' ? new Date(value) : value;
  // YYYYMMDDTHHMMSSZ
  return d.toISOString().replace(/-|:|\.\d{3}/g, '');
}

export default function GoogleCalendar({ title, description, location, start, end }: Props) {
  const dates = `${toGCalDate(start)}/${toGCalDate(end)}`;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates,
    details: description || '',
    location: location || '',
    trp: 'false',
  });

  const href = `https://calendar.google.com/calendar/render?${params.toString()}`;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <Button variant="outline">Add to Google Calendar</Button>
    </a>
  );
}
