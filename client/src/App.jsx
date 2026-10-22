import React from 'react'

function App() {
  return (
    <Routes>
      <Routes path="/" element={<Home />} />
      <Routes path="/auth" element={<Auth />} />
    </Routes>
  )
}

export default App