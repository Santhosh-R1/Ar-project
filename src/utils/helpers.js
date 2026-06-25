export const exportProjectJSON = (state) => {
  const data = JSON.stringify({
    objects: state.objects,
    unit: state.unit,
    theme: state.theme
  }, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `construction-project-${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const formatDimension = (val, unit) => {
  if (unit === 'Feet') {
    return `${val.toFixed(2)} ft`;
  }
  return `${(val * 0.3048).toFixed(2)} m`;
};
