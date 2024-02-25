import { Button, Header, Segment } from 'semantic-ui-react';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { useStore } from '../../../app/stores/store';
import { Activity } from '../../../app/models/activity';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MySelectInput from '../../../app/common/form/MySelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import MyDateInput from '../../../app/common/form/MyDateInput';

export default observer(function ActivityForm() {
  const { activityStore } = useStore();
  const { loading, createActivity, updateActivity, loadActivity, loadingInitial } = activityStore;
  const { id } = useParams();
  const navigate = useNavigate();

  const [activity, setActivity] = useState<Activity>({
    id: '',
    title: '',
    date: null,
    description: '',
    category: '',
    city: '',
    venue: '',
  });

  const validationSchema = Yup.object({
    title: Yup.string().required('The activity title is required'),
    description: Yup.string().required('The activity description is required'),
    category: Yup.string().required(),
    date: Yup.string().required('Date is required').nullable(),
    venue: Yup.string().required(),
    city: Yup.string().required(),
  });

  useEffect(() => {
    if (id) loadActivity(id).then(activity => setActivity(activity!));
  }, [id, loadActivity]);

  function handleFormSubmit(activity: Activity) {
    if (!activity.id) {
      activity.id = uuid();
      createActivity(activity).then(() => navigate(`/activities/${activity.id}`));
    } else {
      updateActivity(activity).then(() => navigate(`/activities/${activity.id}`));
    }
  }

  if (loadingInitial) return <LoadingComponent content='Loading Activity...' />;

  return (
    <Segment clearing>
      <Header content='Activity Details' sub color='teal' />
      <Formik
        enableReinitialize
        initialValues={activity}
        validationSchema={validationSchema}
        onSubmit={values => handleFormSubmit(values)}
      >
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
            <MyTextInput name='title' placeholder='Title' />
            <MyTextArea rows={3} name='description' placeholder='Description' />
            <MySelectInput name='category' placeholder='Category' options={categoryOptions} />
            <MyDateInput
              name='date'
              placeholderText='Date'
              showTimeSelect
              timeCaption='time'
              dateFormat='MMMM d, yyyy h:mm aa'
            />
            <Header content='Location details' sub color='teal' />
            <MyTextInput name='city' placeholder='City' />
            <MyTextInput name='venue' placeholder='Venue' />
            <Button
              disabled={isSubmitting || !dirty || !isValid}
              loading={loading}
              floated='right'
              positive
              type='submit'
              content='Submit'
            />
            <Button as={Link} to='/activities' floated='right' type='button' content='Cancel' />
          </Form>
        )}
      </Formik>
    </Segment>
  );
});
