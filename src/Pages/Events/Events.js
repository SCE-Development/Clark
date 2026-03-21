
import config from '../../config/config.json';
import NotFoundPage from '../NotFoundPage/NotFoundPage.js';
import { Redirect } from 'react-router-dom';

export default function EventsPage() {
  return config.SCEvents.ENABLED ? <h1>Events Page</h1> : <Redirect to="/notfound" />;
}
