const Lighting = () => {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 2]} intensity={0.8} />
      <directionalLight position={[-3, -2, 2]} intensity={0.4} />
    </>
  );
};

export default Lighting;
