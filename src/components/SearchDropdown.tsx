import { FC, KeyboardEventHandler, useCallback, useEffect, useRef, useState } from "react";
import styles from './SearchDropdown.module.scss';

interface SearchDropdownProps {
  search: (value: string) => Promise<string[]>;
}

export const SearchDropdown: FC<SearchDropdownProps> = ({ search }) => {
  const [options, setOptions] = useState<string[] | null>(null);
  const [selectIndex, setSelectIndex] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const listElementRefs = useRef<(HTMLLIElement | null)[]>([])
  const dropdownElement = useRef<HTMLUListElement>(null)

  const update = useCallback(async (value: string) => {
    setSearchText(value);
    setIsLoading(true);
    setOptions(await search(value));
    setIsLoading(false);
    setSelectIndex(0);
  }, [search])

  useEffect(() => {
    const element = listElementRefs.current[selectIndex]
    if (element != null) {
      element.scrollIntoView({ block: 'center' })
    }
  }, [selectIndex])

  useEffect(() => {
    setIsOpen(true)
  }, [isOpen])

  useEffect(() => {
    if (isOpen && options == null) {
      update(searchText)
    }
  }, [isOpen, options, searchText, update])

  const chooseOption = (optionIndex: number): void => {
    if (options == null) {
      return
    }

    setSearchText(options[optionIndex]);
    // setOptions([]);
    setIsOpen(false)
  };

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    const isSpecialKey = ["ArrowUp", "ArrowDown", "Enter", "Escape"].some((key) => key === e.key)

    // TODO: Allow `Enter` to submit the form if not open
    if (!isSpecialKey) {
      // setIsOpen(true)
      return;
    }

    if (!isOpen) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true)
      }
      return
    }

    e.preventDefault();

    if (e.key === "Escape") {
      // setOptions([]);
      setIsOpen(false)
      return
    }

    if (e.key === "ArrowUp" && selectIndex > 0) {
      setSelectIndex(selectIndex - 1);
      return;
    }

    if (options == null || options.length === 0) {
      if (e.key === "Enter") {
        setIsOpen(false)
      }
      return;
    }

    if (e.key === "ArrowUp" && selectIndex === 0) {
      setIsOpen(false);
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

  return <div className={`${styles.container} ${isOpen ? styles.open : ''}`} onKeyDown={onKeyDown}>
    <button
      className={styles.closeButton}
      onClick={() => {
        // setOptions([])
        setIsOpen(false)
      }}
    >
      close
    </button>
    <label className={`${styles.field} ${styles.onlyMobile}`}>
      <div>
        Search
      </div>
      <input
        type="text"
        value={searchText}
        onFocus={() => setIsOpen(true)}
        onClick={() => setIsOpen(true)}
        onChange={e => {
          setIsOpen(true)
          update(e.target.value)
        }}
      />
    </label>
    <label className={`${styles.field} ${styles.exceptMobile}`}>
      <div>
        Search
      </div>
      <input
        type="text"
        value={searchText}
        onFocus={() => setIsOpen(true)}
        onClick={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onChange={e => {
          setIsOpen(true)
          update(e.target.value)
        }}
      />
    </label>
    {isOpen && (
      <ul ref={dropdownElement}>
        {isLoading
          ? <small>loading...</small>
          : options?.map((option, i) => (
            <li
              ref={el => listElementRefs.current[i] = el}
              key={option}
              onMouseDown={() => chooseOption(i)}
              className={i === selectIndex ? styles.selected : ''}
            >
              {option}
            </li>
          ))}
      </ul>
    )}
  </div>
}
