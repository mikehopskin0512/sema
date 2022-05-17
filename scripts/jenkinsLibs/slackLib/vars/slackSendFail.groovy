#!/usr/bin/env groovy
def call() {
    def blocks = [
        [
                    'type': 'header',
                    'text': [
                        'type': 'plain_text',
                        'text': 'Job Failed. :red_circle:',
                        'emoji': true
                    ]
                ]
            ]
    slackSend(
        blocks: blocks,
        channel: '#phoenix-circleci-notifications',
        color: 'danger'
    )
}
