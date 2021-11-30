import React from 'react';

import Footer from '@/components/footer';

export default function NoMatch() {
  return (
    <div>
      404 Not Found
      <Footer show={true} position="fixed" />
    </div>
  );
}
