import { useState } from 'react';
import './App.css';

function App() {
  const [amount, setAmount] = useState<string>(''); // 기부 금액
  const [donations, setDonations] = useState<number[]>([]); // 기부 내역

  const onChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyDigits = e.target.value.replace(/\D/g, '');
    setAmount(onlyDigits);
  };

  // "기부하기 클릭 시 내역에 저장"
  const addDonation = () => {
    if (amount) {
      setDonations([...donations, Number(amount)]); // 내역에 추가
      setAmount(''); // 입력창 비우기
    }
  };

  // 총합 계산
  const total = donations.reduce((sum, v) => sum + v, 0);

  const display = amount ? Number(amount).toLocaleString() : '0';

  return (
    <>
      <h1>기부를 쉽고, 안전하게하는 openDonate에 오신 것을 환영합니다.</h1>

      <input
        type="text"
        inputMode="numeric"
        placeholder="기부 금액(숫자) 입력"
        value={amount}
        onChange={onChangeAmount}
      />
      <button onClick={addDonation}>기부하기</button>

      <p>
        기부할 금액 : <string>{display}원</string>
      </p>

      <h2>기부 내역</h2>
      <ul>
        {donations.map((amt, idx) => (
          <li key={idx}>{amt.toLocaleString()} 원</li>
        ))}
      </ul>

      <h3>총 기부 합계 : {total.toLocaleString()} 원</h3>
    </>
  );
}

export default App;
