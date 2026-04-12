import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskCard from '@/components/tasks/TaskCard.vue'
import type { Task } from '@/types/task'

const mockTask: Task = {
  id: 1,
  title: 'Fix login bug',
  description: 'The login form fails on mobile',
  status: 'in_progress',
  priority: 'high',
  creator: { id: 1, name: 'Alice' },
  assigned_to: { id: 2, name: 'Bob' },
  due_date: '2026-04-30',
  tags: [{ id: 1, name: 'bug' }],
  created_at: '2026-04-01T00:00:00Z',
  updated_at: '2026-04-01T00:00:00Z',
}

describe('TaskCard', () => {
  it('renders task title', () => {
    const wrapper = mount(TaskCard, { props: { task: mockTask } })
    expect(wrapper.text()).toContain('Fix login bug')
  })

  it('renders assignee name', () => {
    const wrapper = mount(TaskCard, { props: { task: mockTask } })
    expect(wrapper.text()).toContain('Bob')
  })

  it('emits delete event with task id when delete button is clicked', async () => {
    const wrapper = mount(TaskCard, { props: { task: mockTask } })
    await wrapper.find('button:last-child').trigger('click')
    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')?.[0]).toEqual([1])
  })
})
