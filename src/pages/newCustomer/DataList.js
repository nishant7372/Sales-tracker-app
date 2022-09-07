import styles from "./DataList.module.css";

export default function DataList({ document, id, param }) {
  const suggestions = [];
  document.forEach((element) => {
    if (suggestions.indexOf(element[param]) === -1) {
      suggestions.push(element[param]);
    }
  });
  return (
    <datalist id={id} className={styles["dataList"]}>
      {suggestions.map((element, index) => (
        <option key={index} value={element}>
          {element}
        </option>
      ))}
    </datalist>
  );
}
