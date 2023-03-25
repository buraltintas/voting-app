import { useEffect, useState } from 'react';
import styles from '@/styles/Voting.module.css';
import { collection, getFirestore, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { app } from '@/firebase/index';
import LoadingSpinner from '@/components/loading-spinner';

const ViewVoting = () => {
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const { id } = router.query;

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

  useEffect(() => {
    if (voting) {
      let votes = 0;

      voting[0]?.options.forEach((op) => (votes += op.votes));

      setTotalVotes(votes);
    }
  }, [voting]);

  const percentage = (value) => {
    return value > 0 ? ((100 * value) / totalVotes).toFixed(1) : 0;
  };

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

  const renderVoting = () => {
    return (
      <div className={styles.votingInfoContainer}>
        <h3 className={styles.votingQuestion}>{voting[0].question}</h3>
        {renderDate(voting[0].date)}
        {voting[0].options.map((op) => {
          return (
            <div key={op.name} className={styles.votingInfo}>
              <span className={styles.optionName}>{op.name}</span>
              <span className={styles.optionVotes}>
                {percentage(op.votes)}% {op.votes} vote(s)
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const copyToClipboard = () => {
    let aux = document.createElement('input');
    aux.setAttribute('value', document.getElementById('link').innerHTML);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand('copy');
    document.body.removeChild(aux);

    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <>
      {loading || !id || !voting ? (
        <LoadingSpinner />
      ) : (
        <div className={styles.votingContainer}>
          <h1 className={styles.title}>Voting</h1>
          <span className={styles.infoText}>You can view the voting here</span>
          {renderVoting()}
          <span onClick={copyToClipboard} className={styles.copyText}>
            {copied ? 'Link copied' : 'Click here to copy the voting link'}
          </span>
          <p hidden id='link'>{`http://localhost:3001/vote/${id}`}</p>
          <Link className={styles.backButton} href='/'>
            Go Home
          </Link>
        </div>
      )}
    </>
  );
};

export default ViewVoting;
