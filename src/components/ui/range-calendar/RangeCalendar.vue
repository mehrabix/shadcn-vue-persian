<script lang="ts" setup>
import { cn } from '@/lib/utils';
import { createCalendar, getLocalTimeZone, toCalendar, today } from '@internationalized/date';
import { RangeCalendarRoot, useForwardPropsEmits, type DateRange, type RangeCalendarRootEmits, type RangeCalendarRootProps } from 'radix-vue';
import { computed, ref, type HTMLAttributes } from 'vue';
import { RangeCalendarCell, RangeCalendarCellTrigger, RangeCalendarGrid, RangeCalendarGridBody, RangeCalendarGridHead, RangeCalendarGridRow, RangeCalendarHeadCell, RangeCalendarHeader, RangeCalendarHeading, RangeCalendarNextButton, RangeCalendarPrevButton } from '.';

const props = defineProps<RangeCalendarRootProps & { class?: HTMLAttributes['class'] }>()

const emits = defineEmits<RangeCalendarRootEmits>()



const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})

const locale = ref('fa-IR')
const calendar = ref('persian')

const placeholder = computed(() => {
  const todayDate = today(getLocalTimeZone());
  const currentCalendar = createCalendar(calendar.value);
  return toCalendar(todayDate, currentCalendar);
});

const handleDayClicked = (date: DateRange) => {
  emits('update:modelValue', date);
}


const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <RangeCalendarRoot
    v-slot="{ grid, weekDays }"
    :class="cn('p-3', props.class)"
    v-bind="forwarded"
    :locale="locale"
    :placeholder="placeholder"
  >
    <RangeCalendarHeader dir="rtl">
      <RangeCalendarPrevButton />
      <RangeCalendarHeading />
      <RangeCalendarNextButton />
    </RangeCalendarHeader>

    <div class="flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
      <RangeCalendarGrid dir="rtl" v-for="month in grid" :key="month.value.toString()">
        <RangeCalendarGridHead>
          <RangeCalendarGridRow>
            <RangeCalendarHeadCell
              v-for="day in weekDays" :key="day"
            >
              {{ day }}
            </RangeCalendarHeadCell>
          </RangeCalendarGridRow>
        </RangeCalendarGridHead>
        <RangeCalendarGridBody>
          <RangeCalendarGridRow v-for="(weekDates, index) in month.rows" :key="`weekDate-${index}`" class="mt-2 w-full">
            <RangeCalendarCell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
            >
              <RangeCalendarCellTrigger
                :day="weekDate"
                :month="month.value"
                @click="handleDayClicked(weekDate)"
                />
            </RangeCalendarCell>
          </RangeCalendarGridRow>
        </RangeCalendarGridBody>
      </RangeCalendarGrid>
    </div>
  </RangeCalendarRoot>
</template>CalendarDate, type ComputedRef, 
