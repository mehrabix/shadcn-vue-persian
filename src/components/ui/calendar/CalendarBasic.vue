<script lang="ts" setup>
import { type HTMLAttributes, computed, ref, type Ref } from 'vue'
import { CalendarRoot, type CalendarRootEmits, type CalendarRootProps, useForwardPropsEmits } from 'radix-vue'
import { CalendarCell, CalendarCellTrigger, CalendarGrid, CalendarGridBody, CalendarGridHead, CalendarGridRow, CalendarHeadCell, CalendarHeader, CalendarHeading, CalendarNextButton, CalendarPrevButton } from '.'
import { createCalendar, getLocalTimeZone, toCalendar, today, type DateValue } from '@internationalized/date'
import { cn } from '@/lib/utils'
import { useVModel } from '@vueuse/core'

const props = defineProps<CalendarRootProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<CalendarRootEmits>()
const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})
const forwarded = useForwardPropsEmits(delegatedProps, emits)

const locale = ref('fa-IR')
const calendar = ref('persian')

const defaultDateValue = toCalendar(today(getLocalTimeZone()), createCalendar(calendar.value))

const placeholder = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: defaultDateValue,
}) as Ref<DateValue>

const handleDayClicked = (date: DateValue) => {
  emits('update:modelValue', date)
}

</script>

<template>
  <CalendarRoot v-slot="{ grid, weekDays }" :class="cn('p-3', props.class)" v-bind="forwarded" :locale="locale"
    v-model:placeholder="placeholder">
    <CalendarHeader dir="rtl">
      <CalendarPrevButton />
      <CalendarHeading />
      <CalendarNextButton />
    </CalendarHeader>

    <div class="flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
      <CalendarGrid dir="rtl" v-for="month in grid" :key="month.value.toString()">
        <CalendarGridHead>
          <CalendarGridRow dir="rtl">
            <CalendarHeadCell v-for="day in weekDays" :key="day">
              {{ day }}
            </CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>
        <CalendarGridBody>
          <CalendarGridRow v-for="(weekDates, index) in month.rows" :key="`weekDate-${index}`" class="mt-2 w-full">
            <CalendarCell v-for="weekDate in weekDates" :key="weekDate.toString()" :date="weekDate" @click="handleDayClicked(weekDate)">
              <CalendarCellTrigger :day="weekDate" :month="month.value" />
            </CalendarCell>
          </CalendarGridRow>
        </CalendarGridBody>
      </CalendarGrid>
    </div>
  </CalendarRoot>
</template>
