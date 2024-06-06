<script setup lang="ts">
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
  today,
  type DateValue
} from '@internationalized/date'
import { ref, type Ref } from 'vue'

import { Button } from '@/components/ui/button'
import { Calendar, CalenderAdvanced } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RangeCalendar } from '@/components/ui/range-calendar'
import { cn } from '@/lib/utils'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import type { DateRange } from 'radix-vue'
import Select from '@/components/ui/select/Select.vue'
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue'
import SelectValue from '@/components/ui/select/SelectValue.vue'
import SelectContent from '@/components/ui/select/SelectContent.vue'
import SelectItem from '@/components/ui/select/SelectItem.vue'

const df = new DateFormatter('fa-IR', {
  dateStyle: 'long'
})

const valuesingle = ref<DateValue>()

const start = undefined
const end = undefined


const valueMulti = ref({
  start,
  end,
}) as Ref<DateRange>

const valueRange = ref({
  start: undefined,
  end: undefined,
}) as Ref<DateRange>

const valuePresets = ref<DateValue>()


const items = [
  { value: 0, label: 'امروز' },
  { value: 1, label: 'فردا' },
  { value: 3, label: '3 روز بعد' },
  { value: 7, label: 'یک هفته بعد' },
]



function handleMultiValueChange(e: DateRange) {
  if (e.start && e.end) {
    console.log({
      start: new Date(e.start.toDate(getLocalTimeZone())),
      end: new Date(e.end.toDate(getLocalTimeZone()))
    })
  }
}

function handleSingleValueChange(e: DateValue | undefined) {
  if (e) {
    console.log(new Date(e.toDate(getLocalTimeZone())))
  }
}

</script>

<template>
  <div class="flex flex-col">
    <Popover>
      <PopoverTrigger as-child>
        <Button dir="rtl" variant="outline" :class="cn(
          'w-[280px] justify-start text-left font-normal',
          !valuesingle && 'text-muted-foreground',
        )">
          <CalendarIcon class="ml-2 h-4 w-4" />
          {{ valuesingle ? df.format(valuesingle.toDate(getLocalTimeZone())) : "انتخاب تاریخ" }}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <CalenderAdvanced @update:modelValue="handleSingleValueChange" v-bind:week-starts-on="0" v-model="valuesingle"
          initial-focus />
      </PopoverContent>
    </Popover>
    <Popover>
      <PopoverTrigger as-child>
        <Button dir="rtl" variant="outline" :class="cn(
          'w-[280px] justify-start text-left font-normal',
          !valuesingle && 'text-muted-foreground',
        )">
          <CalendarIcon class="ml-2 h-4 w-4" />
          {{ valuesingle ? df.format(valuesingle.toDate(getLocalTimeZone())) : "انتخاب تاریخ" }}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <Calendar @update:modelValue="handleSingleValueChange" v-bind:week-starts-on="0" v-model="valuesingle"
          initial-focus />
      </PopoverContent>
    </Popover>
    <Popover>
      <PopoverTrigger as-child>
        <Button dir="rtl" variant="outline" :class="cn(
          'w-[280px] justify-start text-left font-normal',
          !valueMulti && 'text-muted-foreground',
        )">
          <CalendarIcon class="ml-2 h-4 w-4 text-center" />
          {{ (valueMulti.start && valueMulti.end) ? df.format(valueMulti.start.toDate(getLocalTimeZone())) + ' - ' +
            df.format(valueMulti.end.toDate(getLocalTimeZone())) :
            "انتخاب تاریخ" }}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <RangeCalendar @update:modelValue="handleMultiValueChange" v-bind:week-starts-on="0" v-model="valueMulti"
          initial-focus />
      </PopoverContent>
    </Popover>

    <Popover>
      <PopoverTrigger as-child>
        <Button dir="rtl" variant="outline" :class="cn(
          'w-[280px] justify-start text-left font-normal',
          !valueRange && 'text-muted-foreground',
        )">
          <CalendarIcon class="ml-2 h-4 w-4" />
          <template v-if="valueRange.start">
            <template v-if="valueRange.end">
              {{ df.format(valueRange.start.toDate(getLocalTimeZone())) }} - {{
                df.format(valueRange.end.toDate(getLocalTimeZone())) }}
            </template>

            <template v-else>
              {{ df.format(valueRange.start.toDate(getLocalTimeZone())) }}
            </template>
          </template>
          <template v-else>
            انتخاب تاریخ
          </template>
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <RangeCalendar v-model="valueRange" initial-focus :number-of-months="2"
          @update:start-value="(startDate) => valueRange.start = startDate" />
      </PopoverContent>
    </Popover>
    <Popover>
      <PopoverTrigger as-child>
        <Button dir="rtl" variant="outline" :class="cn(
          'w-[280px] justify-start text-left font-normal',
          !valuePresets && 'text-muted-foreground',
        )">
          <CalendarIcon class="ml-2 h-4 w-4" />
          {{ valuePresets ? df.format(valuePresets.toDate(getLocalTimeZone())) : "انتخاب تاریخ" }}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="flex w-auto flex-col gap-y-2 p-2">
        <Select dir="rtl" @update:model-value="(v) => {
          if (!v) return;
          valuePresets = today(getLocalTimeZone()).add({ days: Number(v) });
        }">
          <SelectTrigger>
            <SelectValue placeholder="بازه زمانی" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="item in items" :key="item.value" :value="item.value.toString()">
              {{ item.label }}
            </SelectItem>
          </SelectContent>
        </Select>
        <Calendar @update:modelValue="handleSingleValueChange" v-bind:week-starts-on="0" v-model="valuePresets"
          initial-focus />
      </PopoverContent>
    </Popover>
  </div>
</template>
