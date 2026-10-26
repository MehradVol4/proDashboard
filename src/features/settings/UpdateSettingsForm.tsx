import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import Textarea from '../../ui/Textarea';
import Spinner from '../../ui/Spinner';
import Heading from '../../ui/Heading';
import { useSettings } from "./useSettings";
import { useUpdateSetting } from "./useUpdateSetting";

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'US dollar (USD)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'GBP', label: 'British pound (GBP)' },
  { value: 'CAD', label: 'Canadian dollar (CAD)' },
  { value: 'AUD', label: 'Australian dollar (AUD)' },
  { value: 'CHF', label: 'Swiss franc (CHF)' },
  { value: 'SEK', label: 'Swedish krona (SEK)' },
  { value: 'JPY', label: 'Japanese yen (JPY)' },
  { value: 'AED', label: 'UAE dirham (AED)' },
  { value: 'TRY', label: 'Turkish lira (TRY)' },
];

const LOCALE_OPTIONS = [
  { value: 'en', label: 'English (en)' },
  { value: 'en-GB', label: 'English — UK (en-GB)' },
  { value: 'de-DE', label: 'German (de-DE)' },
  { value: 'fr-FR', label: 'French (fr-FR)' },
  { value: 'es-ES', label: 'Spanish (es-ES)' },
  { value: 'pt-PT', label: 'Portuguese (pt-PT)' },
  { value: 'sv-SE', label: 'Swedish (sv-SE)' },
  { value: 'ja-JP', label: 'Japanese (ja-JP)' },
];

function UpdateSettingsForm() {

  const { isPending, settings: {
    minBookingLength,
    maxBookingLength,
    maxGuestPerBooking,
    breakfastPrice,
    hotelName,
    hotelLogoUrl,
    currency,
    locale,
    taxRate,
    checkInTime,
    checkOutTime,
    cancellationPolicy,
  } = {}, } = useSettings();

  const { isUpdating, updateSetting } = useUpdateSetting();

  if (isPending) return <Spinner />

  function handleUpdate(e, field) {
    const { value } = e.target;

    if (!value) return;
    updateSetting({ [field]: value })
  }

  // Unlike the numeric fields, clearing these should actually save an empty
  // value rather than silently keep the old one.
  function handleUpdateOptional(e, field, defaultValue = null) {
    const { value } = e.target;
    updateSetting({ [field]: value.trim() === '' ? defaultValue : value });
  }

  return (
    <>
      <Heading as="h3">Booking rules</Heading>

      <Form>
        <FormRow label='Minimum nights/booking'>
          <Input
            type='number'
            id='min-nights'
            disabled={isUpdating}
            defaultValue={minBookingLength}
            onBlur={(e) => handleUpdate(e, 'minBookingLength')}
          />
        </FormRow>

        <FormRow label='Maximum nights/booking'>
          <Input
            type='number'
            id='max-nights'
            defaultValue={maxBookingLength}
            disabled={isUpdating}
            onBlur={(e) => handleUpdate(e, 'maxBookingLength')}
          />
        </FormRow>

        <FormRow label='Maximum guests/booking'>
          <Input
            type='number'
            id='max-guests'
            defaultValue={maxGuestPerBooking}
            disabled={isUpdating}
            onBlur={(e) => handleUpdate(e, 'maxGuestPerBooking')}
          />
        </FormRow>

        <FormRow label='Breakfast price'>
          <Input
            type='number'
            id='breakfast-price'
            defaultValue={breakfastPrice}
            disabled={isUpdating}
            onBlur={(e) => handleUpdate(e, 'breakfastPrice')}
          />
        </FormRow>

        <FormRow label='Check in time'>
          <Input
            type='time'
            id='check-in-time'
            defaultValue={checkInTime ?? ''}
            disabled={isUpdating}
            onBlur={(e) => handleUpdateOptional(e, 'checkInTime')}
          />
        </FormRow>

        <FormRow label='Check out time'>
          <Input
            type='time'
            id='check-out-time'
            defaultValue={checkOutTime ?? ''}
            disabled={isUpdating}
            onBlur={(e) => handleUpdateOptional(e, 'checkOutTime')}
          />
        </FormRow>

        <FormRow label='Cancellation policy'>
          <Textarea
            id='cancellation-policy'
            defaultValue={cancellationPolicy ?? ''}
            disabled={isUpdating}
            onBlur={(e) => handleUpdateOptional(e, 'cancellationPolicy', '')}
          />
        </FormRow>
      </Form>

      <Heading as="h3">Property &amp; billing</Heading>

      <Form>
        <FormRow label='Hotel name'>
          <Input
            type='text'
            id='hotel-name'
            defaultValue={hotelName ?? ''}
            disabled={isUpdating}
            onBlur={(e) => handleUpdateOptional(e, 'hotelName')}
          />
        </FormRow>

        <FormRow label='Logo URL'>
          <Input
            type='url'
            id='hotel-logo-url'
            placeholder='Leave empty to use the bundled logo'
            defaultValue={hotelLogoUrl ?? ''}
            disabled={isUpdating}
            onBlur={(e) => handleUpdateOptional(e, 'hotelLogoUrl')}
          />
        </FormRow>

        <FormRow label='Currency'>
          <Select
            id='currency'
            disabled={isUpdating}
            options={CURRENCY_OPTIONS}
            value={currency ?? 'USD'}
            onChange={(e) => handleUpdate(e, 'currency')}
          />
        </FormRow>

        <FormRow label='Locale'>
          <Select
            id='locale'
            disabled={isUpdating}
            options={LOCALE_OPTIONS}
            value={locale ?? 'en'}
            onChange={(e) => handleUpdate(e, 'locale')}
          />
        </FormRow>

        <FormRow label='Tax / VAT rate (%)'>
          <Input
            type='number'
            id='tax-rate'
            min={0}
            max={100}
            step={0.1}
            defaultValue={taxRate ?? 0}
            disabled={isUpdating}
            onBlur={(e) => handleUpdateOptional(e, 'taxRate', 0)}
          />
        </FormRow>
      </Form>
    </>
  );
}

export default UpdateSettingsForm;
