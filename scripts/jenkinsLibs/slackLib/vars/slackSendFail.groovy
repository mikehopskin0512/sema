#!/usr/bin/env groovy
def call() {
    script {
        def blocks = [[
                    'type': 'header',
                    'text': [
                        'type': 'plain_text',
                        'text': 'Job Failed. :red_circle:',
                        'emoji': true
                    ]
                ],
                [
                    'type': 'section',
                    'fields': [
                        [
                            'type': 'mrkdwn',
                            'text': "*Job*: ${env.JOB_NAME}"
                        ]
                    ]
                ],
                [
                    'type': 'section',
                    'fields': [
                        [
                            'type': 'mrkdwn',
                            'text': '*Project*: phoenix'
                        ],
                        [
                            'type': 'mrkdwn',
                            'text': "*Branch*: ${BRANCH_NAME}"
                        ]
                    ],
                    'accessory': [
                        'type': 'image',
                        'image_url': 'https://www.jenkins.io/images/logos/fire/fire.png',
                        'alt_text': 'failed'
                    ]
                ],
                [
                    'type': 'actions',
                    'elements': [
                        [
                            'type': 'button',
                            'text': [
                                'type': 'plain_text',
                                'text': 'View Job'
                            ],
                            'url': "${BUILD_URL}console"
                        ]
                    ]
                ]
            ]
        slackSend(
        blocks: blocks,
        channel: '#phoenix-circleci-notifications',
        color: 'danger'
    )
    }
}
