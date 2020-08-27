import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import DateRangePicker from 'datetimepicker/DateRangePicker';
import isArray from 'lodash/isArray';

Enzyme.configure({ adapter: new Adapter() });

describe('DateRangePicker', () => {
  it('DateRangePicker has its core function', () => {
    let pop;
    const wrapper = mount(<DateRangePicker showTime isFooterVisible />);
    wrapper
      .find('.picker-input')
      .at(0)
      .simulate('click');
    pop = wrapper.find('.zent-popover');
    expect(pop.find('DatePanel').length).toBe(1);

    pop
      .find('DatePanel')
      .at(0)
      .find('.panel__cell')
      .at(10)
      .simulate('click');
    pop.find('.zent-btn').simulate('click');

    wrapper
      .find('.picker-input')
      .at(1)
      .simulate('click');
    pop = wrapper.find('.zent-popover');
    expect(pop.find('DatePanel').length).toBe(1);

    pop
      .find('DatePanel')
      .at(0)
      .find('.panel__cell')
      .at(10)
      .simulate('click');
    pop.find('.zent-btn').simulate('click');
    wrapper.unmount();
  });

  it('DateRangePicker render value', () => {
    let pop;
    const wrapper = mount(
      <DateRangePicker value={['2017-01-01', '2017-12-30']} isFooterVisible />
    );
    expect(
      wrapper
        .find('.zent-input')
        .at(0)
        .instance().value
    ).toBe('2017-01-01');
    wrapper
      .find('.picker-input')
      .at(0)
      .simulate('click');
    pop = wrapper.find('.zent-popover');

    expect(
      pop
        .find('DatePanel')
        .find('.panel__cell--selected')
        .text()
    ).toBe('1');
    wrapper.unmount();
  });

  it('DateRangePicker is controlled by value', () => {
    let wrapper;
    let pop;
    const onChangeMock = jest.fn().mockImplementation(value => {
      wrapper.setProps({ value });
    });
    wrapper = mount(
      <DateRangePicker onChange={onChangeMock} isFooterVisible />
    );
    wrapper
      .find('.picker-input')
      .at(0)
      .simulate('click');
    pop = wrapper.find('.zent-popover');
    pop
      .find('DatePanel')
      .at(0)
      .find('.panel__cell')
      .at(20)
      .simulate('click');
    pop.find('.zent-btn').simulate('click');
    expect(onChangeMock.mock.calls.length).toBe(1);
    expect(isArray(onChangeMock.mock.calls[0][0])).toBe(true);
    expect(onChangeMock.mock.calls[0][0][1].length).toBe(0);

    wrapper
      .find('.picker-input')
      .at(1)
      .simulate('click');
    pop = wrapper.find('.zent-popover').at(1);
    pop
      .find('DatePanel')
      .at(0)
      .find('.panel__cell')
      .at(20)
      .simulate('click');
    pop.find('.zent-btn').simulate('click');
    expect(isArray(onChangeMock.mock.calls[0][0])).toBe(true);
    wrapper.unmount();
  });

  it('DateRangePicker call onClose with type', () => {
    let wrapper;
    let pop;
    const onClose = jest.fn();
    const onOpen = jest.fn();
    wrapper = mount(
      <DateRangePicker onClose={onClose} onOpen={onOpen} isFooterVisible />
    );
    wrapper
      .find('.picker-input')
      .at(0)
      .simulate('click');
    pop = wrapper.find('.zent-popover');
    pop.find('.zent-btn').simulate('click');

    wrapper
      .find('.picker-input')
      .at(1)
      .simulate('click');
    pop = wrapper.find('.zent-popover').at(1);

    pop.find('.zent-btn').simulate('click');

    expect(onOpen.mock.calls[0][0]).toBe('start');
    expect(onOpen.mock.calls[1][0]).toBe('end');
    expect(onClose.mock.calls[0][0]).toBe('start');
    expect(onClose.mock.calls[1][0]).toBe('end');
    wrapper.unmount();
  });

  it('DateRangePicker disable and confirm protection', () => {
    const onChangeMock = jest.fn();
    let pop;
    let wrapper = mount(
      <DateRangePicker onChange={onChangeMock} isFooterVisible />
    );
    wrapper
      .find('.picker-input')
      .at(0)
      .simulate('click');
    pop = wrapper.find('.zent-popover');
    pop
      .find('DatePanel')
      .at(0)
      .find('.panel__cell')
      .at(10)
      .simulate('click');
    pop.find('.zent-btn').simulate('click');

    wrapper
      .find('.picker-input')
      .at(1)
      .simulate('click');
    pop = wrapper.find('.zent-popover');
    pop
      .find('DatePanel')
      .at(0)
      .find('.panel__cell')
      .at(20)
      .simulate('click');
    pop.find('.zent-btn').simulate('click');

    expect(onChangeMock.mock.calls.length).toBe(2);

    // default disabledDate is noop
    // HACK: branch
    wrapper = mount(<DateRangePicker disabled isFooterVisible />);
    wrapper
      .find('.picker-input')
      .at(0)
      .simulate('click');
    pop = wrapper.find('.zent-popover');

    // support min and max
    pop = mount(
      <DateRangePicker min="2000-01-01" max="2001-01-01" isFooterVisible />
    );
    pop
      .find('.picker-input')
      .at(0)
      .simulate('click');
    expect(pop.find('.panel__cell').every('.panel__cell--disabled')).toBe(true);
    wrapper.unmount();
  });
});
