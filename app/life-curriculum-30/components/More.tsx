export default function More() {
  const items = [
    ["#/books", "Reading shelf", "Your books, with Libby and catalog links and notes"],
    ["#/syllabus", "Syllabus", "Vision, pillars, weekly rhythm, income calculator, open questions"],
    ["#/settings", "Settings and backup", "Your stretching video link, backup and restore"],
  ];
  return (
    <div>
      <h1>More</h1>
      <ul className="lc-morelist">
        {items.map(([href, t, d]) => (
          <li key={href}><a href={href}><b>{t}</b><span>{d}</span></a></li>
        ))}
      </ul>
    </div>
  );
}
