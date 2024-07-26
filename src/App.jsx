import { GbCamProvider } from "./hooks/useGbCam";
import Layout from './components/layout';
import Main from './views/Main';
import { ThemeProvider } from "./hooks/useTheme";

const App = () => {
  return (
    <ThemeProvider>
      <GbCamProvider>
        <Layout>
          <Main />
        </Layout>
      </GbCamProvider>
    </ThemeProvider>
  );
}

export default App;
