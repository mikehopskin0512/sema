import ErrorScreen from '../components/errorScreen';

const NotFound = () => {
  return <ErrorScreen imagePath="/img/404.svg" title="OOOOPS" subtitle="Sorry, we can’t find the page but here is a doughnut!" />;
};

export default NotFound;
