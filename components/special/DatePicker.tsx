import _ from 'lodash';
import { Icon } from '@iconify/react/dist/iconify.js';
import { DatePicker as DatePickerAnt } from 'antd';

const DatePicker = ({ ...props }) => {
    const suffixIcon = _.get(props, 'suffixIcon.name')
    const suffixColor = '#10141A'
    return (
        <DatePickerAnt {...props} suffixIcon={<Icon color={suffixColor} icon={suffixIcon || 'heroicons:calendar-days-20-solid'} />} />
    )
}

export default DatePicker