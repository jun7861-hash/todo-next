import React from 'react'
import { Dialog, Notification } from '@mantine/core'
import { IconCheck } from '@tabler/icons';

const Notifier = ({
    isShow,
    description,
  }: {
    isShow: boolean;
    description: string;
  }) => {
  return (
    <Dialog
        opened={isShow}
        transitionDuration={2}
        size="md"
        style={{ padding: "0", border: "0" }}
      >
        <Notification
          icon={<IconCheck size={18} />}
          color="teal"
          title="Successful"
          disallowClose
        >
          {description}
        </Notification>
      </Dialog>
  )
}

export default Notifier