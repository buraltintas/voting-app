import { useEffect, useState } from 'react';
import styles from '@/styles/View-Votings.module.css';
import Link from 'next/link';

const ViewVotings = () => {
  const [votings, setVotings] = useState([]);

  useEffect(() => {
    const startedVotings = JSON.parse(localStorage.getItem('startedVotings'));

    if (startedVotings) {
      setVotings(startedVotings);
    }
  }, []);

  const renderVotings = () => {
    return votings.map((vote) => {
      return (
        <div key={vote.id} className={styles.link}>
          <span>{vote.question}</span>
          <a
            target='_blank'
            href={`/view/${vote.id}`}
            rel='noopener noreferrer'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 512 512'
              className={styles.linkIcon}
            >
              <path
                d='M384 224v184a40 40 0 01-40 40H104a40 40 0 01-40-40V168a40 40 0 0140-40h167.48M336 64h112v112M224 288L440 72'
                fill='none'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='32'
              />
            </svg>
          </a>
        </div>
      );
    });
  };

  return (
    <>
      <div className={styles.viewVotingsContainer}>
        <h1 className={styles.title}>The Polls You Started</h1>
        <span className={styles.infoText}>You can open your votings here</span>

        {votings.length > 0 ? (
          <div className={styles.votingsList}>{renderVotings()}</div>
        ) : (
          <span className={styles.noVotings}>
            You haven't started a voting yet
          </span>
        )}

        <Link className={styles.backButton} href='/'>
          Go Home
        </Link>
      </div>
    </>
  );
};

export default ViewVotings;
