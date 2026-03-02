#!/usr/bin/env node

import { render } from 'ink';
import React from 'react';
import App from '../dist/app.js';

render(React.createElement(App));
