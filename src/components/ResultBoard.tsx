import { Button, Col, Row } from 'antd';
import { useLocation, useHistory } from 'react-router-dom';
import { STORAGE_KEY_NAMES } from '../shared/constants';
import { storagePropsManager } from '../shared/storageManager';
import { QuizTypes } from '../shared/types';
import { Doughnut } from 'react-chartjs-2';
import { useEffect, useState } from 'react';

interface LocationState {
  from: {
    pathname: string;
  };
  data: QuizTypes;
  score: number;
}

const ResultBoard = () => {
  const location = useLocation<LocationState>();
  const [record, setRecord] = useState();
  const { data, score } = location.state;

  useEffect(() => {
    setRecord(storagePropsManager.getItemProps(STORAGE_KEY_NAMES.RECORD));
    storagePropsManager.setItemProps(STORAGE_KEY_NAMES.SCORE, score);
    storagePropsManager.setItemProps(STORAGE_KEY_NAMES.NUMBER_OF_QUESTION, data);
  }, [record]);

  let history = useHistory();

  const chartData = {
    labels: ['정답', '오답'],
    datasets: [
      {
        label: '정답률',
        data: [
          storagePropsManager.getItemProps(STORAGE_KEY_NAMES.SCORE),
          storagePropsManager.getItemProps(STORAGE_KEY_NAMES.NUMBER_OF_QUESTION).results.length -
            storagePropsManager.getItemProps(STORAGE_KEY_NAMES.SCORE),
        ],
        backgroundColor: ['#6ce07a', '#ec6441'],
        borderWidth: 0,
      },
    ],
  };

  const handlePush = (to: string) => {
    history.push(`/${to}`);
  };
  return (
    <>
      <Row justify="center" align="middle">
        <Col span={18}>
          <Doughnut
            data={chartData}
            style={{ height: '400px' }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </Col>
        <Col span={6}>
          <Button
            onClick={() => handlePush('wrongAnswer')}
            style={{ borderRadius: 10, fontSize: '1rem' }}
          >
            오답노트
          </Button>
          <br />
          <Button onClick={() => handlePush('quiz')} style={{ borderRadius: 10, fontSize: '1rem' }}>
            다시풀기
          </Button>
        </Col>
      </Row>
      <Row justify="center" align="middle">
        <Col>걸린시간{record}</Col>
      </Row>
    </>
  );
};

export { ResultBoard };
