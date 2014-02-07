# -*- coding: utf-8 -*-
"""TODO: docstring"""

from pyramid_basemodel import Base
from pyramid_basemodel import Session
from balistos.models import User
from sqlalchemy import engine_from_config

import os
import sys
import transaction


def main(argv=sys.argv):

    # TODO: check for DB existance etc.? this fails if run more than once
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        print 'DATABASE_URL not set, using default SQLite db.'  # noqa
        db_url = 'sqlite:///./balistos-app.db'

    settings = {'sqlalchemy.url': db_url}
    engine = engine_from_config(settings, 'sqlalchemy.')
    Session.configure(bind=engine)
    Base.metadata.create_all(engine)

    with transaction.manager:
        test_user = User(
            username='one',
            email='one@bar.com',
            fullname=u'Test User',
        )
        Session.add(test_user)

    print 'DB populated with dummy data: {0}'.format(db_url)  # noqa


if __name__ == '__main__':
    main()
