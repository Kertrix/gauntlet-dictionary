// # The MIT License (MIT)

// Copyright © 2024 cswimr

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the “Software”), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// source: https://c.csw.im/cswimr/gauntlet-cswimr-plugins/src/branch/tailwindcss/utils/open-url.ts

const getOpenCommand = (platform: typeof Deno.build.os): string => {
  const commands = {
    windows: 'start',
    darwin: 'open',
    linux: 'xdg-open',
    freebsd: 'xdg-open',
    netbsd: 'xdg-open',
    android: 'open',
    solaris: 'firefox', //FIXME - use a different command that doesn't force a specific browser
    aix: 'firefox',
    illumos: 'firefox',
  } as const;
  return commands[platform] || commands.linux;
};

/**
 * Open a URL in the user's configured default browser
 * @param url The url you want to open in the default browser
 * @returns Promise<Deno.CommandStatus> The status of the command
 */
const open = async (url: string) => {
  // Yes, this function uses Deno. Yes, this repository uses Node.js for tooling.
  // Gauntlet runs loaded plugins in a Deno runtime, so this works fine.
  // Hop off Copilot I know this isn't using Node.js APIs
  console.log('Opening URL:', url);
  const platform = Deno.build.os;
  const cmd = getOpenCommand(platform);
  const process = new Deno.Command(cmd, {
    args: [url],
    env: {
      // https://github.com/project-gauntlet/gauntlet/issues/28
      LD_LIBRARY_PATH: '',
    },
  });
  const child = process.spawn();
  return await child.status;
};

export default open;