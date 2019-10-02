import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import SettingsReducer from 'containers/settings/reducers'

// export const selectStoreData = (state) => {
//   return state['with-store'];
// }

export default (history) => combineReducers({
  router: connectRouter(history),
  ...SettingsReducer,
})