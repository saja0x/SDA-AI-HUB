// تغيير: قبل كذا كان يعرض تاريخ إصدار واحد بس. الحين يعرض كل سجل
// الإصدارات لو متوفر (model.versions) - قاعدة البيانات أصلًا فيها جدول
// كامل لهذا الغرض (model_versions)، بس ما كان يوصلها أي بيانات قبل.
function VersioningInfo({ model }) {
  const versions = model.versions || [];
 
  return (
    <div>
      <h3>Version Info</h3>
      <p>Model: {model.name}</p>
      <p>Latest Release: {model.release}</p>
 
      {versions.length > 0 && (
        <ul>
          {versions.map((v, i) => (
            <li key={i}>
              v{v.version} — {v.release_date ? v.release_date.slice(0, 10) : "—"}
              {v.notes ? ` (${v.notes})` : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
 
export default VersioningInfo;