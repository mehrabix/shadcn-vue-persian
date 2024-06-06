<script lang="ts" setup>
import { CalendarCell, CalendarCellTrigger, CalendarGrid, CalendarGridBody, CalendarGridHead, CalendarGridRow, CalendarHeadCell, CalendarHeader, CalendarHeading } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { createCalendar, getLocalTimeZone, toCalendar, today, type DateValue } from '@internationalized/date'
import { useVModel } from '@vueuse/core'
import { CalendarRoot, useDateFormatter, useForwardPropsEmits, type CalendarRootEmits, type CalendarRootProps } from 'radix-vue'
import { createDecade, createYear, toDate } from 'radix-vue/date'
import { computed, ref, type HTMLAttributes, type Ref } from 'vue'

const props = withDefaults(defineProps<CalendarRootProps & { class?: HTMLAttributes['class'] }>(), {
  modelValue: undefined,
  placeholder() {
    return today(getLocalTimeZone())
  },
  weekdayFormat: 'short',
})
const emits = defineEmits<CalendarRootEmits>()

const delegatedProps = computed(() => {
  const { class: _, placeholder: __, ...delegated } = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)

const formatter = useDateFormatter('fa-IR')


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


const selectedMonth = ref<string>(defaultDateValue.month.toString())
const selectedYear = ref<string>(defaultDateValue.year.toString())


</script>

<template>
  <CalendarRoot v-slot="{ date, grid, weekDays }" v-model:placeholder="placeholder" v-bind="forwarded"
    :class="cn('rounded-md border p-3', props.class)" :locale="locale">
    <CalendarHeader dir="rtl">
      <CalendarHeading class="flex w-full items-center justify-between gap-2">
        <Select dir="rtl" :model-value="selectedMonth" @update:model-value="(v) => {
          placeholder = placeholder.set({
            month: Number(v),
          })
          selectedMonth = v
        }">
          <SelectTrigger aria-label="Select month" class="w-[60%]">
            <SelectValue placeholder="ماه" />
          </SelectTrigger>
          <SelectContent class="max-h-[200px]">
            <SelectItem v-for="month in createYear({ dateObj: date })" :key="month.toString()"
              :value="month.month.toString()">
              {{ formatter.custom(toDate(month), { month: 'long' }) }}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select dir="rtl" :default-value="selectedYear" @update:model-value="(v) => {
          placeholder = placeholder.set({
            year: Number(v),
          })
          selectedYear = v
        }">
          <SelectTrigger aria-label="Select year" class="w-[40%]">
            <SelectValue placeholder="سال" />
          </SelectTrigger>
          <SelectContent class="max-h-[200px]">
            <SelectItem v-for="yearValue in createDecade({ dateObj: date, startIndex: -10, endIndex: 10 })"
              :key="yearValue.toString()" :value="yearValue.year.toString()">
              {{ yearValue.year.toLocaleString('fa-IR', { useGrouping: false }) }}
            </SelectItem>
          </SelectContent>
        </Select>
      </CalendarHeading>
    </CalendarHeader>

    <div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
      <CalendarGrid dir="rtl" v-for="month in grid" :key="month.value.toString()">
        <CalendarGridHead>
          <CalendarGridRow>
            <CalendarHeadCell v-for="day in weekDays" :key="day">
              {{ day.charAt(0) }}
            </CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>

        <CalendarGridBody class="grid">
          <CalendarGridRow v-for="(weekDates, index) in month.rows" :key="`weekDate-${index}`" class="mt-2 w-full">
            <CalendarCell v-for="weekDate in weekDates" :key="weekDate.toString()" :date="weekDate">
              <CalendarCellTrigger :day="weekDate" :month="month.value" @click="handleDayClicked(weekDate)" />
            </CalendarCell>
          </CalendarGridRow>
        </CalendarGridBody>
      </CalendarGrid>
    </div>
  </CalendarRoot>
</template>