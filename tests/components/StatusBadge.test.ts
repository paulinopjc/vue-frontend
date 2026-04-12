import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatusBadge from '@/components/shared/StatusBadge.vue'

describe('StatusBadge', () => {
  it('renders "To Do" label for todo status', () => {
    const wrapper = mount(StatusBadge, { props: { status: 'todo' } })
    expect(wrapper.text()).toBe('To Do')
    expect(wrapper.classes()).toContain('bg-gray-100')
  })

  it('renders "In Progress" label with blue color for in_progress status', () => {
    const wrapper = mount(StatusBadge, { props: { status: 'in_progress' } })
    expect(wrapper.text()).toBe('In Progress')
    expect(wrapper.classes()).toContain('bg-blue-100')
  })

  it('renders "Approved" label with green color for approved status', () => {
    const wrapper = mount(StatusBadge, { props: { status: 'approved' } })
    expect(wrapper.text()).toBe('Approved')
    expect(wrapper.classes()).toContain('bg-green-100')
  })
})
