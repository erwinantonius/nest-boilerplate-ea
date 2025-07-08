const unwindBy = (arr, f) => {
  return arr.reduce(
    (r, o) => r.concat(o[f].map((v) => ({ ...o, [f]: v }))),
    [],
  );
};

export default unwindBy;
