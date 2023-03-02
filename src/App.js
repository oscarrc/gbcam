import { CamIcon } from "./components/partials";
import { CameraProvider } from "./hooks/useCamera";
import Layout from './components/layout';
import Main from './views/Main';
const App = () => {
  return (
    <CameraProvider>
      <Layout>
        <Main />
        <CamIcon className="yellow" selfie={false} />
      </Layout>
    </CameraProvider>
  );
}

export default App;
