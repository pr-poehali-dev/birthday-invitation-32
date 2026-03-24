import json
import os
import urllib.request

CHAT_ID = "1054386200"  # @Aleksandrovnaksss v2


def handler(event: dict, context) -> dict:
    """Принимает RSVP от гостя и отправляет уведомление в Telegram."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    body = json.loads(event.get('body', '{}'))
    name = body.get('name', 'Неизвестный')
    attending = body.get('attending', 'yes')
    guests = body.get('guests', '1')
    wish = body.get('wish', '')

    attending_text = '✅ Придёт' if attending == 'yes' else '❌ Не придёт'
    guests_text = f'\n👥 Гостей: {guests}' if attending == 'yes' else ''
    wish_text = f'\n🍾 Алкоголь: {wish}' if wish else ''

    message = (
        f'🎉 Новый RSVP!\n\n'
        f'👤 Имя: {name}\n'
        f'{attending_text}'
        f'{guests_text}'
        f'{wish_text}'
    )

    token = os.environ['TELEGRAM_BOT_TOKEN']
    url = f'https://api.telegram.org/bot{token}/sendMessage'
    payload = json.dumps({'chat_id': int(CHAT_ID), 'text': message}).encode()

    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})
    try:
        resp = urllib.request.urlopen(req)
        resp_body = resp.read().decode()
    except urllib.error.HTTPError as e:
        err_body = e.read().decode()
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'ok': False, 'error': err_body})
        }

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True, 'tg': resp_body})
    }