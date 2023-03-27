import { GbCamProvider } from "./hooks/useGbCam";
import Layout from './components/layout';
import Main from './views/Main';

const App = () => {
  return (
    <GbCamProvider>
      <Layout>
        <Main />
      </Layout>
    </GbCamProvider>
  );
}

export default App;
