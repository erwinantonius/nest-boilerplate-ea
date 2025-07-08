export const ReshapingOptions = {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.id;
    return ret;
  },
};
