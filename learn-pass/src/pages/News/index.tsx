import React, { useState } from 'react';
import PullDown from '@/components/PullDown';

export default function News() {
  const [fresh, setFresh] = useState(Math.random());
  return (
    <>
      <PullDown
        onRefresh={() => {
          setFresh(Math.random());
        }}
      >
        <p>{fresh}</p>
      </PullDown>
    </>
  );
}
