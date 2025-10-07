export const getComponentType = (value: string) => {
  const valueType = value.toLowerCase();
  const isForm = ['form'].includes(valueType);
  const isNoChildren =
    ['list', 'collapse', 'icon'].includes(valueType) || valueType.includes('chart');
  const isChart = valueType.includes('chart');
  const isUseOptionsData = ['select', 'radio', 'checkbox'].includes(valueType);
  const isInput = [
    'inputtext',
    'inputnumber',
    'radio',
    'checkbox',
    'select',
    'datepicker',
    'textarea',
    'switch',
  ].includes(valueType);
  const isMap = ['map'].includes(valueType);
  const isDatePicker = valueType === 'datepicker';
  const isFeebBack = ['modal', 'drawer'].includes(valueType);
  const isBagde = valueType === 'badge';
  return {
    isUseOptionsData,
    isForm,
    isNoChildren,
    isChart,
    isInput,
    isFeebBack,
    isDatePicker,
    isMap,
    isBagde,
  };
};
