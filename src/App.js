import { CameraProvider } from "./hooks/useCamera";
import Layout from './components/layout';
import Main from './views/Main';

const App = () => {
  return (
    <CameraProvider>
      <Layout>
        <Main />
      </Layout>
    </CameraProvider>
  );
}

export default App;
