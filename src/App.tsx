import { FC } from 'react';
import styles from './App.module.scss';
import { SearchDropdown } from './components/SearchDropdown';

export const App: FC = () => {
  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <SearchDropdown />
      </form>
    </div>
  );
}
