import { Client } from 'eris';
import { ReactionCollector } from 'eris-collectors';

/**
 * 
 * @param {Client} client 
 */
export function reactionCollector(client) {
    client.on('messageCreate', async message => {
        if (message.content !== 'rc') return;

        const reply = await client.createMessage(message.channel.id, {
            content: 'Reaction collector',
            messageReference: {
                failIfNotExists: true,
                channelID: message.channel.id,
                guildID: message.guildID,
                messageID: message.id
            }
        });

        const collector = new ReactionCollector({
            client,
            message: reply,
            max: 10
        });

        console.log(`Started ReactionCollector!`);

        collector.on('collect', async (collected) => console.log(`Collected Reaction: ${collected.id} ${collected.burst ? '(burst)' : ''}`));
        collector.on('dispose', async (collected) => console.log(`Disposed Reaction: ${collected.id}`));
        collector.on('reactorAdd', async (reactor) => console.log(`Reactor Add: ${reactor.username}`));
        collector.on('reactorDelete', async (reactor) => console.log(`Reactor Delete: ${reactor.username}`));

        collector.on('end', async (collection, reason) => {
            console.log(`ReactionCollector ended: ${reason || 'No reason'}`);

            await reply.edit({
                content: reason || 'No reason',
                embeds: [
                    {
                        description: collection.toJSON().join('\n')
                    }
                ]
            });
        });
    });
}