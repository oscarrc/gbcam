import Layout from './components/layout';
import Main from './views/Main';
import { CameraProvider } from "./hooks/useCamera";

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
