import { FC } from 'react';
import styles from './App.module.scss';
import { SearchDropdown } from './components/SearchDropdown';

const list = [
  "brazil",
  "brilho",
  "boo",
  "ayyy",

  "Due",
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
    return [...list];
  }

  await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));

  return list.filter((item) => item.toLowerCase().includes(text.toLowerCase()));
};

export const App: FC = () => {
  return (
    <div className={styles.container}>
      <form className={styles.form}
        onSubmit={e => {
          e.preventDefault()
          console.log('sent!')
        }}>
        <SearchDropdown search={search} />
        <input type="submit" value="send" />
      </form>
    </div>
  );
}
