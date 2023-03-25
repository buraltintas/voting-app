import styles from '@/styles/Main-Page.module.css';
import Link from 'next/link';

const MainPage = () => {
  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.title}>Vote For Me</h1>
      <span className={styles.infoText}>
        You can start new voting <br /> - or - <br /> view your votings you
        started
      </span>

      <div className={styles.buttons}>
        <Link className={styles.button} href='/new-vote'>
          Start
        </Link>
        <Link className={styles.button} href='/view-votings'>
          View
        </Link>
      </div>
      <div className={styles.warningContainer}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className={styles.warningIcon}
          viewBox='0 0 512 512'
        >
          <path
            d='M85.57 446.25h340.86a32 32 0 0028.17-47.17L284.18 82.58c-12.09-22.44-44.27-22.44-56.36 0L57.4 399.08a32 32 0 0028.17 47.17z'
            fill='none'
            stroke='#e5595f'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='32'
          />
          <path
            d='M250.26 195.39l5.74 122 5.73-121.95a5.74 5.74 0 00-5.79-6h0a5.74 5.74 0 00-5.68 5.95z'
            fill='none'
            stroke='#e5595f'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='32'
          />
          <path d='M256 397.25a20 20 0 1120-20 20 20 0 01-20 20z' />
        </svg>
        <span className={styles.warning}>
          If you delete local storage you will lose historical voting
          information
        </span>
      </div>
    </div>
  );
};

export default MainPage;
