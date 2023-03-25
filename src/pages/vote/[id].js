import { useEffect, useState, useLayoutEffect } from 'react';
import styles from '@/styles/Vote.module.css';
import {
  collection,
  getFirestore,
  onSnapshot,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { app } from '@/firebase/index';
import { useRouter } from 'next/router';
import LoadingSpinner from '@/components/loading-spinner';
import Link from 'next/link';

const ViewVoting = () => {
  const db = getFirestore(app);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState([]);
  const [vote, setVote] = useState('');
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  let voted;
  const router = useRouter();
  const { id } = router.query;

  if (typeof window !== 'undefined') {
    voted = JSON.parse(localStorage.getItem('voted'));
  }

  useEffect(() => {
    const db = getFirestore(app);
    if (id) {
      setLoading(true);
      onSnapshot(collection(db, id), (snapshot) => {
        if (snapshot.docs.length > 0) {
          setVoting(snapshot.docs.map((doc) => doc.data()));
          setLoading(false);
        }
      });
    }
  }, [id]);

  useLayoutEffect(() => {
    if (voted && voting) {
      const index = voted.findIndex((vote) => vote.id === voting[0]?.id);

      if (index > -1) setAlreadyVoted(true);
    }
  }, [voted]);

  const renderDate = (noteDate) => {
    const date = new Date(noteDate * 1000);
    const day = '0' + date.getDate();
    const month = '0' + (date.getMonth() + 1);
    const hours = '0' + date.getHours();
    const minutes = '0' + date.getMinutes();

    return (
      <div className={styles.dateContainer}>
        <span>Started at</span>
        <p>{`${day.slice(-2)}/${month.slice(-2)}/${date.getFullYear()}`}</p>
        <p>{`${hours.slice(-2)}:${minutes.slice(-2)}`}</p>
      </div>
    );
  };

  const selectOption = (option) => {
    if (option) setVote(option);
  };

  const isButtonDisabled = () => {
    if (!vote) {
      return styles.disabled;
    }
  };

  const sendVote = async () => {
    setLoading(true);

    const noteRef = doc(db, id, voting[0].question);

    const newOptions = voting[0].options.map((opt) => {
      return {
        ...opt,
        votes: vote === opt.name ? opt.votes + 1 : opt.votes,
      };
    });

    try {
      await updateDoc(noteRef, {
        question: voting[0].question,
        date: voting[0].date,
        id: voting[0].id,
        options: newOptions,
      });

      const voted = JSON.parse(localStorage.getItem('voted'));

      if (voted) {
        voted.push({ id: voting[0].id, question: voting[0].question });
        localStorage.setItem('startedVotings', JSON.stringify(startedVotings));
      } else {
        localStorage.setItem(
          'voted',
          JSON.stringify([{ id: voting[0].id, question: voting[0].question }])
        );
      }

      setLoading(false);
      router.push(`/view/${voting[0].id}`);
    } catch (err) {
      alert(err);
      setLoading(false);
    }
  };

  const renderVoting = () => {
    return (
      <div className={styles.votingInfoContainer}>
        <h3 className={styles.votingQuestion}>{voting[0].question}</h3>
        {renderDate(voting[0].date)}
        {voting[0].options.map((op) => {
          return (
            <div key={op.name} className={styles.votingInfo}>
              <span
                onClick={() => !alreadyVoted && selectOption(op.name)}
                className={`${styles.optionName} ${
                  vote === op.name && styles.active
                } ${alreadyVoted && styles.disabled}`}
              >
                {op.name}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {loading || !id || !voting ? (
        <LoadingSpinner />
      ) : (
        <div className={styles.votingContainer}>
          <h1 className={styles.title}>Voting</h1>
          <span className={styles.infoText}>You can vote here</span>
          {renderVoting()}
          {alreadyVoted ? (
            <span>You have already voted</span>
          ) : (
            <button
              onClick={() => vote && sendVote}
              className={`${styles.voteButton} ${isButtonDisabled()}`}
            >
              Vote
            </button>
          )}

          {alreadyVoted && (
            <Link className={styles.viewButton} href={`/view/${voting[0].id}`}>
              View Voting
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default ViewVoting;
