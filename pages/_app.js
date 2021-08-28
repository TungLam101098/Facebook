import "../styles/golobals.css";
// import { Provider } from "next-auth/client"
import {Provider} from 'react-redux';
import { store } from "../redux/app/store";
import "../styles/carousel.css";
import 'antd/dist/antd.css';

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
