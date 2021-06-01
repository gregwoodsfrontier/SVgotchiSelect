import { Layout } from 'components/Layout';
import { useFirebase } from 'firebase-client';
import { Leaderboard as LeaderboardComponent } from 'components/Leaderboard';
import globalStyles from 'theme/globalStyles.module.css';

const Leaderboard = () => {
  const { highscores } = useFirebase();

  return (
    <Layout>
      <div className={globalStyles.container}>
        <LeaderboardComponent highscores={highscores} />
      </div>
    </Layout>
  )
}

export default Leaderboard;