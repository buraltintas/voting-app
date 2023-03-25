import styles from '@/styles/New-Vote.module.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import cuid from 'cuid';
import { useState } from 'react';
import { setDoc, doc, getFirestore } from 'firebase/firestore';
import { app } from '@/firebase/index';
import LoadingSpinner from '@/components/loading-spinner';

const NewVote = () => {
  const db = getFirestore(app);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [s, setState] = useState({
    question: '',
    options: [],
    optionText: '',
    showInputCounter: false,
  });

  const updateQuestion = (e) => {
    setState((prevState) => ({
      ...prevState,
      question: e.target.value,
    }));
  };

  const updateOptionText = (e) => {
    setState((prevState) => ({
      ...prevState,
      optionText: e.target.value,
    }));
  };

  const onFocusHandler = (focused) => {
    setState((prevState) => ({
      ...prevState,
      showInputCounter: focused,
    }));
  };

  const addOption = () => {
    if (s.optionText.length < 1 || s.options.length > 5) return;
    let options = s.options;
    const isOptionExists =
      options.findIndex((el) => el.name === s.optionText) > -1;

    if (isOptionExists) return;

    options.push({ name: s.optionText, votes: 0 });

    setState((prevState) => ({
      ...prevState,
      options: options,
      optionText: '',
    }));
  };

  const deleteOption = (option) => {
    const newOptions = s.options.filter((el) => el.name !== option);

    setState((prevState) => ({
      ...prevState,
      options: newOptions,
    }));
  };

  const renderOptions = () => {
    if (s.options.length < 1) return null;
    return s.options.map((option) => {
      return (
        <div className={styles.option} key={option.name}>
          <span>{option.name}</span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 512 512'
            className={styles.deleteIcon}
            onClick={() => deleteOption(option.name)}
          >
            <path
              d='M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='32'
            />
            <path
              stroke='currentColor'
              strokeLinecap='round'
              strokeMiterlimit='10'
              strokeWidth='32'
              d='M80 112h352'
            />
            <path
              d='M192 112V72h0a23.93 23.93 0 0124-24h80a23.93 23.93 0 0124 24h0v40M256 176v224M184 176l8 224M328 176l-8 224'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='32'
            />
          </svg>
        </div>
      );
    });
  };

  const isButtonDisabled = () => {
    if (s.options.length < 2 || !s.question) {
      return styles.disabled;
    }
  };

  const startNewVote = async () => {
    if (s.options.length < 2 || !s.question) return;

    setIsLoading(true);
    const id = cuid();

    const data = {
      date: Math.floor(new Date().getTime() / 1000),
      options: s.options,
      question: s.question,
      id,
    };

    try {
      const docRef = await setDoc(
        doc(db, `${data.id}`, `${data.question}`),
        data
      );
      setIsLoading(false);
      const startedVotings = JSON.parse(localStorage.getItem('startedVotings'));

      if (startedVotings) {
        startedVotings.push({ id: data.id, question: data.question });
        localStorage.setItem('startedVotings', JSON.stringify(startedVotings));
      } else {
        localStorage.setItem(
          'startedVotings',
          JSON.stringify([{ id: data.id, question: data.question }])
        );
      }

      setState({
        question: '',
        options: [],
        optionText: '',
        showInputCounter: false,
      });

      router.push(`/view/${data.id}`);
    } catch (err) {
      alert('Something went wrong, please try again!', err);
      setIsLoading(false);
    }
  };

  const renderNewVote = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    } else {
      return (
        <div className={styles.newVoteContainer}>
          <h1 className={styles.title}>Create New Vote</h1>
          <span className={styles.infoText}>
            Create a question and up to 6 options for voting
          </span>
          <div className={styles.inputContainer}>
            <input
              maxLength={60}
              placeholder='Question'
              type='text'
              value={s.question}
              onChange={updateQuestion}
              onFocus={() => onFocusHandler(true)}
              onBlur={() => onFocusHandler(false)}
              className={styles.questionInput}
            />
            {(s.showInputCounter || s.question.length > 0) && (
              <span className={styles.inputCounter}>
                {s.question.length} / 60
              </span>
            )}
          </div>
          <div className={styles.optonsContainer}>
            {s.options.length > 0 && (
              <div className={styles.options}>{renderOptions()}</div>
            )}
            {s.options.length < 6 && (
              <div className={styles.addOption}>
                <input
                  className={styles.optionInput}
                  value={s.optionText}
                  onChange={updateOptionText}
                  placeholder='Option'
                />
                <button className={styles.addButton} onClick={addOption}>
                  Add
                </button>
              </div>
            )}
          </div>
          <button
            className={`${styles.startButton} ${isButtonDisabled()}`}
            onClick={startNewVote}
          >
            Start New Vote
          </button>
          <Link className={styles.backButton} href='/'>
            Go Back
          </Link>
        </div>
      );
    }
  };

  return <>{renderNewVote()}</>;
};

export default NewVote;
