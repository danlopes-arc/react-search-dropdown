import { ChangeEventHandler, FC, KeyboardEventHandler, useEffect, useRef, useState } from "react";
import styles from './SearchDropdown.module.scss'

const list = [
  "brazil",
  "brilho",
  "boo",
  "ayyy",

  "Due",
  "to",
  "the",
  "improv",
  "nature",
  "of",
  "Critical",
  "Role",
  "other",
  "RPG",
  "content",
  "on",
  "our",
  "channels,",
  "themes",
  "and",
  "situations",
  "that",
  "occur",
  "in-game",
  "may",
  "be",
  "difficult",
  "for",
  "some",
  "to",
  "handle"
];

const search = async (text: string): Promise<string[]> => {
  if (text === "") {
    return [];
  }

  await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));

  return list.filter((item) => item.toLowerCase().includes(text.toLowerCase()));
};

export const SearchDropdown: FC = () => {
  const [options, setOptions] = useState<string[]>([]);
  const [selectIndex, setSelectIndex] = useState(-1);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const listElementRefs = useRef<(HTMLLIElement | null)[]>([])
  const dropdownElement = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const element = listElementRefs.current[selectIndex]
    if (element != null) {
      element.scrollIntoView()
    }
  }, [selectIndex])

  const chooseOption = (optionIndex: number): void => {
    setSearchText(options[optionIndex]);
    setOptions([]);
    setIsOpen(false)
  };

  const onChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const { value } = e.target;
    setSearchText(value);
    setIsLoading(true);
    setOptions(await search(value));
    setIsLoading(false);
    setSelectIndex(-1);
  };

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (["ArrowUp", "ArrowDown", "Enter", "Escape"].every((key) => key !== e.key)) {
      setIsOpen(true)
      return;
    }

    e.preventDefault();

    if (e.key === "Escape") {
      setOptions([]);
      setIsOpen(false)
      return
    }

    if (options.length === 0) {
      return;
    }

    if (e.key === "ArrowUp" && selectIndex > 0) {
      setSelectIndex(selectIndex - 1);
      return;
    }

    if (e.key === "ArrowDown" && selectIndex < options.length - 1) {
      setSelectIndex(selectIndex + 1);
      return;
    }

    if (e.key === "Enter" && selectIndex >= 0) {
      chooseOption(selectIndex);
      return
    }

  };

  return <div className={`${styles.searchDropdown} ${isOpen ? styles.open : ''}`} onKeyDown={onKeyDown}>
    <button className={styles.closeButton} onClick={() => {
      setOptions([])
      setIsOpen(false)
    }}>close</button>
    <label className={`${styles.field} ${isOpen ? styles.open : ''}`}>
      <div>
        Search
      </div>
      <input
        onFocus={() => setIsOpen(true)}
        onClick={() => setIsOpen(true)}
        onBlur={() => setOptions([])}
        type="text"
        onChange={onChange}
        value={searchText}
      />
    </label>
    {(options.length !== 0 || isLoading) && (
      <ul className={styles.dropdown} ref={dropdownElement}>
        {isLoading && <small>loading...</small>}
        {options.map((option, i) => (
          <li
            tabIndex={-1}
            ref={el => listElementRefs.current[i] = el}
            key={option}
            onMouseDown={() => chooseOption(i)}
            className={`${i === selectIndex ? styles.selected : ''}`}
          >
            {option}
          </li>
        ))}
      </ul>
    )}
  </div>
}